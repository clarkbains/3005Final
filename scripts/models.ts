export class DatabaseFriend extends DatabaseModel {
    friendid: number
    user1: number //fk:Users:userid:
    user2: number //fk:Users:userid:

}

export class DatabasePendingFriend extends DatabaseModel {
    pendingfriendid: number
    user1: number //fk:Users:userid:
    user2: number //fk:Users:userid:
    msg: string | null

}


export class DatabaseUser extends DatabaseModel {
    userid: number
    name: string
    username: string //unique
    email: string //unique
    score: number //def:0:
    totalGames: number //def:0:
    private: boolean //def:0:

}
export class DatabaseCredential extends DatabaseModel {
    credentialid: number
    userid: string
    salt: string
    hash: string

}
export class DatabaseGame extends DatabaseModel {
    gameid: number
    matchid: number
    currentturn: number
    gamefinished: boolean
    userid:number|null
}
export class DatabaseGameMessage extends DatabaseModel {
    gamemessageid: number
    gameid: number
    userid: number
    msg: string
    time: number // def:strftime('%s','now'):


}
export class DatabaseMove extends DatabaseModel {
    moveid: number
    gameid: number
    userid: number
    x: number
    y: number
    time: number

}
//Used to show a general match
export class DatabaseMatch extends DatabaseModel {

    matchid: number
    userid: number //creator
    width: number
    height: number
    participants: number //number of target participants
    msg: string | null //Game msg
    name: string //Gamename def:strftime('Game %Y-%m-%d %H-%M','now'):
    privacylevel: number//0 public,1 friends only,2 private def:0:
    status: number //0,1 def:0:
}
export class Message {
    msg: string
    userid: number
    time: Date
}
//Used to show a users acceptance or declanation of a match
export class DatabaseMatchAcceptance extends DatabaseModel {
    matcchacceptanceid: number
    matchid: number //correlated with match
    userid: number | null //owner
    status: number //0:pending,1:accepted,2:denied def:0:
    msg: string | null //Optional Message for decliners

}

export class PragmaTableInfo {
    cid: number
    name: string
    type: string
    notnull: number
    dflt_value: any
    pk: number //Primary Key


}
