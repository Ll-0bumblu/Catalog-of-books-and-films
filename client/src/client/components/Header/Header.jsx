import './Header.css';

export default function Catalog({appName, appLogo, userName, userLogo}) {
    return (
        <header className="header">
            <div className="container">
                <img src={appLogo} alt="app logo" className="app-logo" />
                <h1 className="app__name">{appName}</h1>
            </div>
            <div className="container">
                <img src={userLogo} alt="user logo" className="logo" />
                <p className="user__name">{userName}</p>
            </div>
        </header>
    )
}