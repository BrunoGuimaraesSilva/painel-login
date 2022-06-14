import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";
import { setCookie } from 'nookies'
import api from "../services/request";

interface InterDados {
    email: string;
    senha: string;
}
interface InterAutenticacaoContext {
    logar(dados: InterDados): Promise<void>;
}

export const AutenticacaoContext = createContext(
    {} as InterAutenticacaoContext
);

interface InterProviderProps {
    children: ReactNode;
}
export function AutenticacaoProvider(
    { children }: InterProviderProps
) {

    const router = useRouter();

    const [usuario, setUsuario] = useState();

    async function logar(dados: InterDados) {
        try {

            let resultado = await api.post('/login', dados)

            // Localstorage
            // sessionStorage
            // Cookies

            setCookie(
                undefined,
                'painel-token',
                resultado.data.token
            )

            router.push('/dashboard');


        } catch (error) {

        }
    }

    return (
        <AutenticacaoContext.Provider value={{ logar }}>
            {children}
        </AutenticacaoContext.Provider>
    )

}
