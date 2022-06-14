import { AutenticacaoProvider } from '../contexts/AutenticacaoContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../styles/styles.css';

function MyApp({ Component, pageProps }) {
    return (
        <AutenticacaoProvider>
            <Component {...pageProps} />
        </AutenticacaoProvider>
    )
}

export default MyApp
