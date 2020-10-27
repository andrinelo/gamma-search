import React from 'react'
import { useSelector } from 'react-redux';



export default function GremlinQueryDisplay(props) {
    let fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))
    
    return (
      <div style={{maxWidth: '40vw', margin: 'auto'}}>
        <p style={{wordBreak: 'break-all', textAlign: 'center', fontSize: 'small'}}><b>Current results generated from gremlin query</b><br/><i>{fullGremlinQuery}</i></p>
      </div>
    )
}