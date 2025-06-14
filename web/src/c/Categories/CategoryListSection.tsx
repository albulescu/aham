"use client"

import { css } from "@emotion/react";
import { ArrowRight } from "@mui/icons-material";
import { Button, CircularProgress, Stack, Typography } from "@mui/joy";
import Link from "next/link";
import { FC } from "react";
import Section from "../section";
import { Category } from "../types";

export interface CategoryListSectionProps {
  category: Category;
  title?: boolean
  showMoreButton?:boolean;
}

export interface CategoryProps {
  category: Category;
}

export const Item: FC<CategoryProps> = ({ category }) => {
  return (
    <div
      css={css(`
            display: flex;
            align-items: center;
            justify-  nt: flex-start;
            margin-bottom: 20px;
            svg {
                margin-right: 15px;
                min-width: 42px;
            }
      `)}
    >
      <Icon color="#F2F2F2" />
      <Link href={`/${category.href}`} prefetch={false}>
        <span>{category.name}</span>
      </Link>
    </div>
  );
};

const CategoryListSection: FC<CategoryListSectionProps> = ({ category, title = true, showMoreButton = true }) => {
    
  if (!category) {
    return (
      <Stack flexDirection="row" gap={1} css={css`padding: 20px 0;`}>
        <CircularProgress size="sm"></CircularProgress>
        <Typography level="h3">Încărcare categorii</Typography>
      </Stack>
    )
  }

  if (!category.children || category.children.length == 0) {
    return null;
  }

  return (
    <Section title={title ? (category?.name || "Categorii") : ''} after={showMoreButton ? <Link href={category.href} prefetch={false}><Button size="lg" variant="plain" endDecorator={<ArrowRight/>}>Vezi toate categoriile</Button></Link> : null}>
      <div
        css={css(`
              display: grid;
              @media only screen and (min-width : 1200px) {
                  grid-template-columns: 1fr 1fr 1fr;
                  gap: 0px 0px; 
                  grid-template-areas: 
                      ". . .";
              }
          `)}
      >
        {(category?.children || []).map((c, i) => (
          <Item key={i} category={c} />
        ))}
      </div>
    </Section>
  );
};

interface IconProps {
  color: string;
}

export const Icon: FC<IconProps> = ({ color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={42} height={42}>
      <g fill="none" fillRule="evenodd">
        <circle cx={21} cy={21} r={21} fill={color} />
        <path
          fill="gray"
          fillRule="nonzero"
          d="M23.216 21 17 14.867 18.892 13 27 21l-8.108 8L17 27.133z"
        />
      </g>
    </svg>
  );
};

export default CategoryListSection;