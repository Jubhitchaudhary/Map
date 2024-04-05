import {Outlet, Link} from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <nav>
                <ul>
                    <li className="home-link" key="home-button">
                        <Link style={{color: "#c65f5f"}} to="/">Home</Link> 
                        {/** use Link so the button actually link to the homepage */}
                    </li>
                </ul>
            </nav>
            <Outlet/>{/** Dont really get it but will comeback */}

        </div>
    )
}

export default Layout;

