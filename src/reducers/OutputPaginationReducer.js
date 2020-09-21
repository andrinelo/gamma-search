import {OUTPUT_NEXT_PAGE, OUTPUT_PREVIOUS_PAGE} from '../actions/types'

export default (state = 0, action) => {
    switch (action.type) {
        case (OUTPUT_PREVIOUS_PAGE):
            return Math.max(0, state-1)
        case (OUTPUT_NEXT_PAGE):
            return state + 1
        default:
            return state
    }
}
