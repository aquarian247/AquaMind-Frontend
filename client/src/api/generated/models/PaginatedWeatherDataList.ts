/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WeatherData } from './WeatherData';
export type PaginatedWeatherDataList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<WeatherData>;
};

