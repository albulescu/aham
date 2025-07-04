'use client';

import getApiFetch from "@/api/api";
import { Add, Delete, Home, KeyboardDoubleArrowRight, Preview, Style } from "@mui/icons-material";
import { Breadcrumbs, Card, Checkbox, CircularProgress, DialogContent, DialogTitle, Divider, IconButton, Input, Link as JoyLink, Modal, ModalClose, ModalDialog, Stack, Table } from "@mui/joy";
import { FC, useEffect, useReducer, useState } from "react";
import { Category, Prop } from "../types";
import { css } from "@emotion/react";
import { CategoryTreeNode, categoryTreeRootFromArray } from "./core";

const CategoriesEditor:FC = () => {
    
    const api = getApiFetch();

    const [root, setRoot] = useState<CategoryTreeNode>();
    const [node, setNode] = useState<CategoryTreeNode>();
    const [props, setProps] = useState<Prop[]>([]);
    const [assigned, setAssigned] = useState<{[key:string]:Prop | undefined}>({});
    const [assignProps, setAssignProps] = useState<boolean>(false);
    const [assignTo, setAssignTo] = useState<CategoryTreeNode | null>(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const update = () => {
        api<Category[]>('/categories?tree=true').then(
            (categories) => {
                const root = categoryTreeRootFromArray(categories);
                setRoot(root);
                setNode(root);
            }
        )

        api<Prop[]>(`/props`).then(setProps);
    };

    const setNodeByCategoryID = (id: number) => {
        const found = root?.findByID(id);
        if (found) {
            setNode(found);
        } else {
            console.error(`Node with id ${id} not found from root`);
        }
    }

    const createNewNodes = (n = 1) => {
        if (node) {
            
            for(let i=0; i < n; i++) {
                node.create();
            }

            forceUpdate();
        }
    }

    const deleteCurrentNode = (node: CategoryTreeNode) => {

        let msg = 'Delete category?'

        if (node.name != "") {
            msg = `Delete ${node.name}?`
        }

        if (!node.id) {
            msg = `Delete newly added category?`
        }

        if (confirm(msg)) {
            const category = node.remove();
            if (category && category.id) {
                api<Category>(`/categories/${category?.id}`, {
                    method:'DELETE',
                    success: true,
                }).then(
                    ()=> {
                        forceUpdate();
                    }
                );
            }
        }
    }

    const saveCurrentNodeData = (item: CategoryTreeNode) => {
        
        item.saving = true;
        
        forceUpdate();
        
        if (item.category.id) {

            api<Category>(`/categories/${item.category.id}`, {
                method:'PUT',
                body: JSON.stringify({
                    name: item.name,
                    slug: item.slug,
                    parent: item.parent?.id !== -1 ? item.parent?.id : undefined
                })
            }).then(
                (response)=> {
                    item.saving = false;
                    item.category = response;
                    forceUpdate();
                }
            );

            return
        }

        api<Category>(`/categories`, {
            method:'POST',
            body: JSON.stringify({
                name: item.name,
                slug: item.slug,
                parent: node?.id !== -1 ? node?.id : undefined
            })
        }).then(
            (response)=> {
                item.saving = false;
                item.category = response;
                forceUpdate();
            }
        );
    }

    const makeSlugFromName = (node: CategoryTreeNode) => {
        node.category.slug = slugify(node.name);
        forceUpdate();
        saveCurrentNodeData(node);
    }

    const showPropAssign = (node: CategoryTreeNode) => {
        
        if (!node) {
            console.error("node must be non empty");
            return;
        }

        api<Prop[]>(`/categories/${node.id}/props`).then((props: any) => {
            if(props && props.length) {
                const data: {[key: string]:Prop} = {};
                props.forEach((item: Prop) => {
                    data[item.id] = item;
                })
                setAssigned(data);
            } else {
                setAssigned({});
            }
        });

        setAssignProps(true);
        setAssignTo(node);
    }

    const onPropAssignChange = (item: Prop, checked:boolean) => {
        if (assignTo) {
            if (!checked) {
                api(`/props/assign/${item.id}/${assignTo?.id}`, {method:'DELETE'}).then(() => {});
            } else {
                api(`/props/assign`,{
                    method: 'POST',
                    body: JSON.stringify({
                        category: assignTo?.id,
                        prop: item.id,
                    })
                }).then(() => {});
            }

            const data = {...assigned};
            data[item.id] = checked ? item : undefined;
            setAssigned(data);
        }
    }

    useEffect(() => update(), []);

    return (
        <div>
            <Stack gap={1}>
                <Breadcrumbs separator="›" aria-label="breadcrumbs">
                    <Home onClick={() => root?.id !== undefined && setNodeByCategoryID(root.id)} style={{cursor: 'pointer'}} sx={{ mr: 0.5 }} />
                    {node?.path.map((item, index) => <JoyLink key={index} onClick={() => setNodeByCategoryID(item.id)}>
                        {item.name}
                    </JoyLink>)}
                    <Add onClick={() => createNewNodes()} style={{cursor: 'pointer'}} sx={{ mr: 0.5 }} />
                </Breadcrumbs>
            </Stack>
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>ID</th>
                        <th>Nume</th>
                        <th>Slug</th>
                        <th style={{ width: '4%' }}>#</th>
                        <th style={{ width: '15%' }}>Actiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {((node||{}).children||[]).map((item, index) => (
                        <tr key={index}>
                            <td>
                                {!item.saving && (item.id || '#')}
                                {item.saving && <CircularProgress size="sm"/>}
                            </td>
                            <td>
                                <Input
                                    size="sm"
                                    value={item.name}
                                    onChange={(e) => {
                                        item.category.name = e.target.value;
                                        forceUpdate();
                                    }}
                                    onBlur={() => saveCurrentNodeData(item)}
                                />
                            </td>
                            <td>
                                <Input
                                    size="sm"
                                    startDecorator={(
                                            <IconButton
                                                size="sm"
                                                variant="soft"
                                                onClick={() => makeSlugFromName(item)}
                                            >
                                                <KeyboardDoubleArrowRight/>
                                            </IconButton>
                                        )}
                                    value={item.slug}
                                    onChange={(e) => {
                                        item.category.slug = e.target.value
                                        forceUpdate();
                                    }}
                                    onBlur={() => saveCurrentNodeData(item)}
                                />
                            </td>
                            <td>
                                {item.children.length}
                            </td>
                            <td>
                                <Stack direction="row" gap={1}>
                                    {(item.children||[]) && (
                                        <IconButton
                                            size="sm"
                                            variant="soft"
                                            onClick={()=>setNode(item)}
                                        >
                                            <Preview/>
                                        </IconButton>
                                    )}
                                    <IconButton
                                        size="sm"
                                        variant="soft"
                                        onClick={() => showPropAssign(item)}
                                    >
                                        <Style/>
                                    </IconButton>
                                    <IconButton
                                        size="sm"
                                        variant="soft"
                                        onClick={() => deleteCurrentNode(item)}
                                    >
                                        <Delete/>
                                    </IconButton>
                                </Stack>
                            </td>
                        </tr>))}
                </tbody>
            </Table>

            <Modal open={assignProps} onClose={() => setAssignProps(false)}>
                <ModalDialog layout="fullscreen" variant="outlined" role="alertdialog">
                    <ModalClose />
                    <DialogTitle>
                        Atribuire proprietăți dinamice pentru <strong>{assignTo?.name}</strong>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <div
                            css={css`
                                 > * { float: left; margin: 5px;}
                            `}
                        >
                        {props.map((item, index) => (
                            <Card key={index} size="sm">
                                <Checkbox
                                    label={item.title +' '+ (item.options ? JSON.stringify(item.options?.values) : '')}
                                    name={item.name}
                                    size="sm"
                                    disabled={assigned[item.id]?.inherited}
                                    checked={assigned[item.id] !== undefined}
                                    onChange={(e) => onPropAssignChange(item, e.target.checked)}
                                />
                            </Card>
                        ))}
                        </div>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </div>
    )
}

function slugify(str: string): string {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
  }

export default CategoriesEditor;