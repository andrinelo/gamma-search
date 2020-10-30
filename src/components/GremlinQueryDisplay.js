import React from 'react'
import { useSelector } from 'react-redux';

// Component used to output the current gremlin query string
export default function GremlinQueryDisplay(props) {
    let fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join("") + ".dedup()")
    
    return (
      <div style={{maxWidth: '40vw', margin: 'auto'}}>
        <p style={{wordBreak: 'break-all', textAlign: 'center', fontSize: 'medium'}}><b>Current results generated from gremlin query</b><br/><i>{fullGremlinQuery}</i></p>
      </div>
    )
}