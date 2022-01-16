import TopNav from "./../components/TopNav";
import "../styles/globals.css";
import "antd/dist/antd.css";
const MyApp = ({ Component, pageProps }) => {
    return (
        <>
            <TopNav />
            <Component {...pageProps} />
        </>
    )
}
export default MyApp;