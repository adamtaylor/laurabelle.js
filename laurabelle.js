var jerk = require( 'jerk' ),
sys      = require( 'sys' ),
sqlite   = require( './vendor/sqlite' );

var options = {
    server: 'irc.freenode.net',
    nick: 'Laurabelle', 
    channels: [ '#kkkk' ]
}

jerk( function( j ) {
    var db = new sqlite.Database();

    j.watch_for( 'soup', function( message ) {
        message.say( message.user + ': soup is good food!' )
    })

    j.watch_for( /^(.+) is (.*)/, function( message ) {
        message.say( 'Okay, ' + message.user + ': ' + message.match_data[1] + ' is ' + message.match_data[2] )
        db.open("info.db", function (error) {
            if (error) {
                throw error;
            }
            db.execute(
                "INSERT INTO factoids (thing,fact) VALUES (?,?)",
                [message.match_data[1], message.match_data[2]],
                function (error, rows) {
                      if (error) throw error;
                }
            );
        });
    })

    j.watch_for( /^(\w+)\?/, function( message ) {
        db.open("info.db", function (error) {
            if (error) {
                throw error;
            }
            db.execute(
                "SELECT fact FROM factoids WHERE thing = ?",
                [message.match_data[1]],
                function (error, rows) {
                    if (error) {
                        throw error;
                    }
                    message.say( message.user + ':' +  message.match_data[1] + ' is ' + rows[0].fact )
                }
            );
        });
    })

    j.watch_for( /^forget (\w+)/, function( message ) {
        db.open("info.db", function (error) {
            if (error) {
                throw error;
            }
            db.execute(
                "DELETE FROM factoids WHERE thing = ?",
                [message.match_data[1]],
                function (error, rows) {
                    if (error) {
                        throw error;
                    }
                    message.say( message.user + ': I forgot ' +  message.match_data[1] )
                }
            );
        });
    })

}).connect( options )
