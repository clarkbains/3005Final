req = {
    page:1, // 1 based indexing
    limit:50,
}
res = {
    meta: {
        page:8, //From Req
        limit:50, //From Req
        total:399,
        count:49 //Max available to send for current page 
    },
    items: [
        {
            isbn:"foo"
        },
        //48 more items
    ]

}