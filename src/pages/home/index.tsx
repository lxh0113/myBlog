import Header from "./components/header"
import Body from "./components/body"

import { Outlet } from "react-router-dom"

import "./index.scss"

export default function Home(){
    return (
        <div className="homeBody">
            <Header></Header>
            <Body></Body>
            <Outlet></Outlet>
        </div>
    )
}

