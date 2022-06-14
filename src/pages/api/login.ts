import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken';
// npm install
// npm run dev
export default (
    request: NextApiRequest,
    response: NextApiResponse
) => {

    const { email, senha } = request.body

    if (request.method === 'POST') {
        try {

            if (
                email === 'teste@gmail.com' &&
                senha === '123'
            ) {
                const token = jwt.sign({
                    id: 1,
                    nome: 'teste',
                    email,
                    permissoes: 'admin'
                },
                    '123456',
                    {
                        expiresIn: 60 * 15
                    }
                )

                return response.status(200)
                    .json({ token: token });

            }

            return response.status(401)
                .json({
                    message: 'Usuario invalido!'
                });

        } catch (error: any) {
            response.status(500).json({
                erro: error.message
            });
        }
    }

    response.status(404).json({ erro: 'Pagina nao encontrada!' });

}
