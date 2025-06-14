import { getAccessToken } from "@/c/Auth";
import getDomain, { Domain } from "../c/domain";

export interface ApiFetchProps {
    version?: string
}

export interface RequestInitEnhanced {
    success?: boolean
    text?:boolean
}

const getApiFetch = (props?:ApiFetchProps) => {

    const version = props?.version || 'v1';
    
    const api = getDomain(Domain.Api, '/' + version)

    return async <T>(
        input: string | URL | globalThis.Request,
        init?: RequestInit & RequestInitEnhanced,
    ): Promise<T> => {

        const token = await getAccessToken();

        input = api + input;

        if (typeof(init) === 'undefined') {
            init = {};
        }

        init.headers = {
            ...init.headers,
            'Authorization': `Bearer ${token}`,
        };

        return new Promise((resolve, reject) => {
            try {
                fetch(input, init).then(
                    (response) => {

                        if (response.status === 401) {
                            reject('unauthorized');
                            return
                        }

                        if (init.success && response.status >= 200 && response.status <= 205) {
                            resolve(null as T)
                            return
                        }

                        if (init.text) {
                            response.text().then(
                                (txt) => resolve(txt as T),
                            ).catch(
                                (err) => {
                                    reject(err)
                                }
                            );
                            return
                        }

                        response.json().then(
                            (obj) => resolve(obj),
                        ).catch(
                            (err) => {
                                reject(err)
                            }
                        );
                    }
                ).catch(
                    (error) => {
                        reject(error);
                    }
                )
            }catch(e) {
                reject(e)
            }
        });
    }
}

export default getApiFetch;