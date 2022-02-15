import { PostInfo } from "./ghost-yvdl";
/**
 * the perfect parser based on react-native-html-parser
 * @param data
 * @param options if fetch_video_size is false (default) the videoSize property will be undefined and no (HEAD methode) will take place
 */
export default function miFbParser(data: string, options?: {
    fetch_video_size: boolean;
}): Promise<PostInfo>;
//# sourceMappingURL=MiFbParser.d.ts.map