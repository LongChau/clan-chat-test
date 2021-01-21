let currentPlayerId;
let titleId;
let result;
let database;
let response;

const CloudScript = {
    Init : (title, playerId, db, r, callback) => {
        currentPlayerId = playerId;
        titleId  = title;
        database = db.ref(titleId);
        response = r;

        // reset response
        result = {
            Success: true,
            PlayerId : currentPlayerId
        };

        //MasterData.LoadAsync(callback);

        callback();
    },
    Commands : {}
};