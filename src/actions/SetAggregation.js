import {SET_AGGREGATION} from './types.js';

export function setAggregation(aggregation, cloudId){
    return {
        type: SET_AGGREGATION,
        value: aggregation, 
        cloudId
    }
}