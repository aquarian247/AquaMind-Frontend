/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enhanced serializer for CSV file upload.
 */
export type CSVUpload = {
    file: string;
    /**
     * * `temperature` - temperature
     * * `fcr` - fcr
     * * `mortality` - mortality
     */
    data_type: 'temperature' | 'fcr' | 'mortality';
    profile_name: string;
    validate_only?: boolean;
};

