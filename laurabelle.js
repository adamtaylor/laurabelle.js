var jerk = require( 'jerk' )

var options = {
    server: 'irc.freenode.net',
    nick: 'Laurabelle', 
    channels: [ '#kkkk',  ]
}

jerk( function( j ) {

  j.watch_for( 'soup', function( message ) {
    message.say( message.user + ': soup is good food!' )
  })

  j.watch_for( /^(.+) is (.*)/, function( message ) {
    message.say( 'Okay, ' + message.user + ': ' + message.match_data[1] + ' is ' + message.match_data[2] )
  })

}).connect( options )
