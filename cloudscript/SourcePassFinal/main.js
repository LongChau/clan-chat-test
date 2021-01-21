
CloudScript.Commands.HelloWorld = args => {
    response.send(  {result : "hello world!"} );
}

CloudScript.Commands.InsertData = args => {

    let key = args.Key;
    let val = args.Value;

    database
        .child(key)
        .set(val)
        .then( response.send({result: "success"}) );
}
 

CloudScript.Commands.GetData = args => {

    let key = args.Key;

    database
        .child(key)
        .once('value')
        .then(snap => {
            response.send({result: snap.val() });
        })
}

CloudScript.Commands.DoSomething = args => {
    response.send({ result : "DoSomething()" });
}

module.exports = CloudScript;