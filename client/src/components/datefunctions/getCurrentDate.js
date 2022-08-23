import moment from "moment"
export function getCurrentDate() {
    return moment().hour(0).minute(0).second(0).millisecond(0)
}