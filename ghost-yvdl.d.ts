export declare class YVDL_Task {
    cb_statusChange: any;
    cb_videoSaved: any;
    cb_conversionProgress: any;
    cb_downloadProgress: any;
    cb_failed: any;
    constructor(query: string, website: string, mp3: boolean, out_path?: string, filename?: string);
    my_id: number;
    uid: string;
    my_url: string;
    my_website: Website;
    mp3conversion: boolean;
    status: yvdl_task_status;
    outputFileName: string;
    outputPath: string;
    post_info: PostInfo;
    download_prog: DownloadProg;
    conversion_prog: number;
    failurReason: string;
    currentState(): StateObj;
    onDownloadProg(prog: number, t: number): void;
    onConversionProg(ffmpeg_prog: number): void;
    /**
     * Start downloading, and then converting if mp3 is set
     */
    Go(): void;
    /**
     * runs ffmpeg
     *
     * you don't wanna deal with this, use the go_conversion
     * @param input the input file name and path
     * @param output the output file name and path
     * @param onProgress the progress callback, takes the native ffmpeg progress object
     * @returns promise the string is just the output filename so u dont have to use is
     */
    mp3Converter(input: string, output: string, onProgress: Function): Promise<string>;
    /**
     * start converting, this only requires an existent mp4 to work on, that means it can be called
          externaly at any later time (no mp3 flag is involved )
     */
    Go_Conversion(): Promise<void>;
    /**
     * Initialize the task by fetching post info, like the older yass2049 approach, but with significant tweaks
     */
    Init(options?: {
        name: string;
    }): Promise<StateObj>;
}
declare class Website {
    constructor(name: string);
    name: string;
    /**
     *
     * @param url url to test
     * @returns true: valid url, false: unvalid url
     */
    veryfi_url(url: string): boolean;
}
export interface PostInfo {
    ThumbnailUrl: string;
    Title: string;
    VideoSize: number;
    VideoUrl: string;
}
declare class DownloadProg {
    constructor(initial?: {
        d: number;
        t: number;
    });
    d: number;
    t: number;
    get percent(): number;
}
export declare function verbo(str: any, degree?: number, write_log?: boolean, force_log?: boolean): void;
/**
 * returns true if the string is a valid URL and is withing the list of websites if any was passed, and returns false otherwise
 *
 * it shows loggings when thing go wrong, disable those with the log paramm set false
 * in case of a false return there's no way to know whether it's because the string is not a valid url or it just doesnt meet the acceptWebsites condition,
 * @param str
 * @param acceptWebsites
 */
export declare function isValidUrl(str: string, acceptWebsites?: string[], log?: boolean): boolean;
declare class StateObj implements ISavedTask {
    constructor(props: {
        id?: number;
        uid?: string;
        status?: yvdl_task_status;
        thumbnail?: string;
        download_prog?: DownloadProg;
        converting_prog?: number;
        post_info?: PostInfo;
        mp3?: boolean;
        outputmp4?: string;
        outputmp3?: string;
        failurReason?: string;
    });
    id: number;
    uid: string;
    status: yvdl_task_status;
    thumbnail: string;
    download_prog: DownloadProg;
    converting_prog: number;
    post_info: PostInfo;
    mp3: boolean;
    outputmp4: string;
    outputmp3: string;
    failurReason: string;
}
export declare class YVDL_API {
    /**
     * // used to be User
     * this is supposed to handle everything user related
     * @example
     * let yass = new User(socket,uid,"yass",true)
     */
    constructor();
    tasks: Array<YVDL_Task>;
    /**
     * this will initialize the events listening, e.g, yvdl-request, delete/cancle
     * this is a weird approach but ok, it works bitch
     */
    Init(): YVDL_API;
    /**
     * save the current user as a json named after the id e.g:"78542457.json", if already it overrides it
     *
     *  can be used to create a new user page
     * @param folder directory where to save the file, defaults to ./database
     */
    savePage(folder?: string): Promise<void>;
    /** official 1-nov API
     * this will look for a .json file named after the user id,
     * if none was found it'll throw an error
     * @param folder the target folder, defaults to './database'
     */
    loadPage(folder?: string): Promise<void>;
}
declare type yvdl_task_status = "zero" | "pending" | "downloading" | "converting" | "done" | "failed" | "deleted" | "delivered";
interface ISavedTask {
    id: number;
    uid: string;
    status: yvdl_task_status;
    download_prog: {
        d: number;
        t: number;
    };
    converting_prog: number;
    post_info: PostInfo;
    mp3: boolean;
    outputmp4: string;
    outputmp3: string;
}
export {};
//# sourceMappingURL=ghost-yvdl.d.ts.map