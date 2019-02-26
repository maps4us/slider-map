import {DateMode} from '../date/markers';

export interface MetaData {
    pin: string;
    icon: string;
    publishedDate: string;
    title: string;
    hasDates: boolean;
    dateMode: DateMode;
    minDate: Date;
    maxDate: Date;
}
