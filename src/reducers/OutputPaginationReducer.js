export default (state = 0, action) => {
    switch (action.type) {
        case ('PREVIOUS_PAGE'):
            return Math.max(0, state-1)
        case ('NEXT_PAGE'):
            return state + 1
        default:
            return state
    }
}