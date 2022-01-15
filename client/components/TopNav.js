import { Menu } from "antd";
import Link from "next/link";
import { AppstoreOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons'
const { Item } = Menu;

const TopNav = () => {
    return (
        <Menu mode="horizontal" style={{ flexJustify: 'center' }}>
            <Item key='app' icon={<AppstoreOutlined />}>
                <Link href={"/"}>
                    <a>Aspire</a>
                </Link>
            </Item >
            <Item key='login' icon={<LoginOutlined />}>
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </Item>
            <Item key='register' icon={<UserAddOutlined />}>
                <Link href={"/register"}>
                    <a>Register</a>
                </Link>
            </Item>
        </Menu>
    )
}

export default TopNav;