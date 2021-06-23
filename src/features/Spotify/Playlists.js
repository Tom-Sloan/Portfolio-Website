import { useEffect, useState } from "react";
import Spotify from "./Spotify";
import styles from './Playlists.module.css';

export function Playlists() {
    const [playlists, setPlaylists] = useState([])

    const fetchPlaylists = async () => {
        const temp = await Spotify.getPlaylists('danneasmith');
        setPlaylists(temp);
    }

    useEffect(() => {
        fetchPlaylists();
    }, [])

    const handleClick = (e) => {
        console.log(playlists)
        console.log(document.querySelector(`.${styles.spotifyParent}`))
        // console.log(`https://open.spotify.com/embed/album/${playlists[0].id}`)
    }

    return (
        <div className={styles.spotifyParent} onClick={handleClick} >
            {playlists.length > 0 && (
                playlists.map((playlist) => (
                    <div className={styles.spotifyPlaylist}  >
                        <iframe src={`https://open.spotify.com/embed/playlist/${playlist.id}`} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                        <div className={styles.spotifyText} >
                            <div className={styles.bubble} >
                                <h2>{playlist.name}</h2>
                                <p dangerouslySetInnerHTML={{ __html: playlist.description }} ></p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}