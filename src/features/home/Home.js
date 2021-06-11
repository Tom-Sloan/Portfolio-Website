import styles from './Home.module.css';

export function Home () {
    return (
        <div className={styles.home} >
            <div className={styles.top} >
                <div className={styles.profile} >
                    <img src="https://i2.wp.com/news.microsoft.com/europe/wp-content/themes/microsoft-news-center-2016/assets/img/default-avatar.png?ssl=1" alt="Profile" />
                </div>
                <div className={styles.name} >
                    <h1>FirstName LastName</h1>
                </div>
            </div>
            <div className={styles.divider} >
                <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices ante risus, id ultricies metus sagittis quis. Nulla turpis sem.</h1>
            </div>
        </div>
    );
}