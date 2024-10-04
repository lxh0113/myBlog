
import { ArticleLabel } from "../types";
import http from "../utils/http";

export const changeArticleLabelsAPI=(data:ArticleLabel[])=>{
    return http({
        url:'/articleLabel',
        method:"POST",
        data
    })
}