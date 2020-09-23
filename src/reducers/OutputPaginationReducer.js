import {OUTPUT_NEXT_PAGE, OUTPUT_PREVIOUS_PAGE, RESET_PAGE_NUMBER} from '../actions/types'

export default (state = 0, action) => {
    switch (action.type) {
        case (OUTPUT_PREVIOUS_PAGE):
            return Math.max(0, state-1)
        case (OUTPUT_NEXT_PAGE):
            return state + 1
        case (RESET_PAGE_NUMBER):
            return 0    
        default:
            return state
    }
}
