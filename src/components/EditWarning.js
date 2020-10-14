import React from "react";
import {Alert, AlertTitle} from "@material-ui/lab";



function EditWarning() {

    return(
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          You are about to edit the query in a middle node. All subsequent nodes will be removed.
        </Alert>
    )
}

export default EditWarning;