import { AppProps } from 'next/app'
import Layout from '../components/layout'

export default function MyApp(props: AppProps) {
    return (
        <Layout>
            <props.Component {...props.pageProps} />
        </Layout>
    )
}