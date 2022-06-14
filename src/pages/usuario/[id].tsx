import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Menu } from '../../components/Menu';
import api from '../../services/request';
import { validaPermissao } from '../../services/validaPermissao';

interface interfProps {
    token?: string;
}

export default function Usuario(props: interfProps) {

    const router = useRouter();

    const refForm = useRef<any>();

    const { id } = router.query;

    const [estaEditando, setEstaEditando] = useState(false);

    useEffect(() => {

        const idParam = Number(id);

        if (Number.isInteger(idParam)) {


            api.get('/usuarios/' + idParam, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            }).then((res) => {
                if (res.data) {

                    setEstaEditando(true);

                    refForm.current['nome'].value = res.data.nome
                    refForm.current['email'].value = res.data.email
                    refForm.current['telefone'].value = res.data.telefone
                    refForm.current['tipo'].value = res.data.tipo
                    refForm.current['cpf'].value = res.data?.cpf || ''
                    refForm.current['endereco'].value = res.data?.endereco || ''
                    refForm.current['bairro'].value = res.data?.bairro || ''
                    refForm.current['numero'].value = res.data?.numero || ''

                }
            }).catch((erro) => {
                console.log(erro)
            })
        }

    }, [])

    const submitForm = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (refForm.current.checkValidity()) {

            let obj: any = new Object;

            for (let index = 0; index < refForm.current.length; index++) {
                const id = refForm.current[index]?.id;
                const value = refForm.current[index]?.value;

                if (id === 'botao') break;
                obj[id] = value;

            }

            api.post('/usuario', obj, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then((res) => {

                    router.push('/usuario')

                }).catch((err) => {
                    console.log(err)
                })

        } else {
            refForm.current.classList.add('was-validated')
        }

    }, [])

    const editForm = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (refForm.current.checkValidity()) {
            let obj: any = new Object;

            for (let index = 0; index < refForm.current.length; index++) {
                const id = refForm.current[index].id;
                const value = refForm.current[index].value;

                if(id === 'botao'
                    || (id === 'senha' && value === '')
                ) {
                    break;
                }
                obj[id] = value;


            }


            api.put('/usuarios/'+id, obj, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            }).then((res) => {
                router.push('/usuario')
            })



        }  else {
            refForm.current.classList.add('was-validated')
        }
    }, [])

    return (
        <>
            <Menu
                active="usuario"
                token={props.token}
            >

                <h1>Usuário - {
                    !estaEditando
                        ? 'Adicionar'
                        : 'Editar'
                }
                </h1>

                <form
                    className='row g-3 needs-validation'
                    noValidate
                    ref={refForm}
                >
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='nome'
                            className='form-label'
                        >
                            Nome
                        </label>

                        <input
                            type='text'
                            className='form-control'
                            placeholder='Digite seu nome completo'
                            id="nome"
                            required
                        />
                        <div className='invalid-feedback'>
                            Por favor digite seu nome completo.
                        </div>

                    </div>
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='email'
                            className='form-label'
                        >
                            Email
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <span
                                className='input-group-text'
                            >@</span>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Digite o email'
                                id="email"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor digite seu email.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='telefone'
                            className='form-label'
                        >
                            Telefone
                        </label>

                        <input
                            type='tel'
                            className='form-control'
                            placeholder='Digite seu telefone'
                            id="telefone"
                            required
                        />
                        <div className='invalid-feedback'>
                            Por favor digite seu telefone.
                        </div>

                    </div>

                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='cpf'
                            className='form-label'
                        >
                            CPF
                        </label>

                        <input
                            type='number'
                            className='form-control'
                            placeholder='Digite seu cpf'
                            id="cpf"
                        // required
                        />
                        <div className='invalid-feedback'>
                            Por favor digite seu cpf.
                        </div>

                    </div>

                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='tipo'
                            className='form-label'
                        >
                            Tipo
                        </label>

                        <select
                            required
                            className='form-select'
                            defaultValue={""}
                            id='tipo'
                        >
                            <option value=''>Selecione o tipo</option>
                            <option value='admin'>Admin</option>
                            <option value='colaborador'>Colaborador</option>
                        </select>
                        <div className='invalid-feedback'>
                            Por favor selecione o tipo.
                        </div>

                    </div>

                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='endereco'
                            className='form-label'
                        >
                            Endereço
                        </label>

                        <input
                            type='text'
                            className='form-control'
                            placeholder='Digite seu endereço'
                            id="endereco"
                        // required
                        />
                    </div>
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='bairro'
                            className='form-label'
                        >
                            Bairro
                        </label>

                        <input
                            type='text'
                            className='form-control'
                            placeholder='Digite seu bairro'
                            id="bairro"
                        // required
                        />
                    </div>
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='numero'
                            className='form-label'
                        >
                            Numero
                        </label>

                        <input
                            type='text'
                            className='form-control'
                            placeholder='Digite seu numero'
                            id="numero"
                        // required
                        />
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='senha'
                            className='form-label'
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            className='form-control'
                            placeholder='Digite sua senha'
                            id="senha"
                            required={!estaEditando}
                        />
                        <div
                            className='invalid-feedback'
                        >
                            Por favor digite sua senha.
                        </div>
                    </div>
                    <div
                        className='col-md-12'
                    >
                        <button
                            className='btn btn-primary mt-3'
                            type='submit'
                            id='botao'
                            onClick={(e) => {
                                estaEditando ?
                                    editForm(e)
                                    :
                                    submitForm(e)
                            }}
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </Menu>
        </>
    )
}

export const getServerSideProps:
    GetServerSideProps = async (contexto) => {
        const { 'painel-token': token } = parseCookies(contexto);

        if (!token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            }
        }

        const temPermissaoPage = validaPermissao(
            token, ['admin']
        )

        if (!temPermissaoPage) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return {
            props: {
                token
            }
        }
    }
