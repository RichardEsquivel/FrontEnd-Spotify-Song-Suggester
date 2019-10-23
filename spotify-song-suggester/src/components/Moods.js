import React from 'react'
import SideNav from "./SideNav";

export default function Moods(props) {
    return (
        <div>
            <SideNav {...props} setSongs={props.setSongs} recommendedIsChecked={props.recommendedIsChecked} setRecs={props.setRecs}></SideNav>
        </div>
    )
}
