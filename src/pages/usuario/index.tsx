import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import api from "../../services/request";
import { validaPermissao } from "../../services/validaPermissao";
interface interfProps {
    token?: string;
}

interface interfUsuario {
    bairro?: string;
    cpf?: string;
    email: string;
    endereco?: string;
    id: number;
    nome: string;
    numero?: string;
    telefone: string;
    tipo: string;
}

export default function Usuario(props: interfProps) {
    const router = useRouter();

    const [usuarios, setUsuarios] = useState<Array<interfUsuario>>([]);

    function searchUsers() {
        api.get("/usuarios", {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                setUsuarios(res.data);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function deleteUser(id: number) {
        api.delete(`/usuarios/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                searchUsers();
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    useEffect(() => {
        searchUsers();
    }, []);

    return (
        <>
            <Head>
                <title>Usuario</title>
            </Head>

            <Menu active="usuario" token={props.token}>
                <>
                    <div
                        className={
                            "d-flex justify-content-between " +
                            "flex-wrap flex-md-nowrap align-items-center" +
                            " pt-3 pb-2 mb-3 border-bottom"
                        }
                    >
                        <h2>Usuário</h2>
                        <div className={"btn-toolbar mb-2 mb-md-0"}>
                            <button
                                className="btn btn-success"
                                type="button"
                                onClick={() => {
                                    router.push("/usuario/adicionar");
                                }}
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((element, index) => {
                            return (
                                <tr key={element.id}>
                                    <td>{element.id}</td>
                                    <td>{element.nome}</td>
                                    <td>{element.email}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                // router.push('/usuario/' + element.id)
                                                router.push(
                                                    `/usuario/${element.id}`
                                                );
                                            }}
                                            style={{
                                                marginRight: 5,
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                deleteUser(element.id);
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Menu>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (contexto) => {
    const { "painel-token": token } = parseCookies(contexto);

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const temPermissaoPage = validaPermissao(token, ["admin"]);

    if (!temPermissaoPage) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }

    return {
        props: {
            token,
        },
    };
};
