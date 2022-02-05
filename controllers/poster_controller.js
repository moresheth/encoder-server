const path      = require( 'path' );
const fs        = require( 'fs' );
const URL       = require( 'url' ).URL;
const dir       = path.join( __dirname, '../posters' );
const process   = require( 'child_process' );

exports.generate = function( req, res ) {
    if ( !req.query.i || !isValidUrl( req.query.i ) || req.query.ms === undefined ) {
        return sendBlank();
    }
    let ms = parseInt( req.query.ms, 10 );
    if ( !ms || isNaN( ms ) ) ms = 0;
    let iName = ( ''+req.query.i ).trim().toLowerCase().replace( /[^a-z0-9]+/g, '' )
    let posterFileName = iName + '_' + ms + '.jpg';
    let cachedFile = path.join( dir, posterFileName );

    fs.stat( cachedFile, function( err, stat ) {
        if ( err === null ) {
            // File exists. Send it back.
            sendImage( posterFileName );
        } else {
            generateImage();
        }
    });

    function sendBlank() {
        sendImage( 'blank-poster.jpg' );
    }

    function sendImage( filename ) {
        let file = path.join( dir, filename );
        let stream = fs.createReadStream( file );
        stream.on( 'open', function() {
            res.set( 'Content-Type', 'image/jpeg' );
            stream.pipe( res );
        });
        stream.on( 'error', function() {
            res.set( 'Content-Type', 'text/plain' );
            res.status( 404 ).end( 'Not found' );
        });
    }

    function generateImage() {
        let com = `ffmpeg -i "${ req.query.i }" -ss ${ ms / 1000 } -frames:v 1 "${ cachedFile }"`;
        let ffmpeg = process.spawn( 'ffmpeg', `-i "${ req.query.i }" -ss ${ ms / 1000 } -frames:v 1 "${ cachedFile }"`.split(' '), { shell: true });
        ffmpeg.on( 'exit', ( code, signal ) => {
            fs.stat( cachedFile, function( err, stat ) {
                if ( err === null ) {
                    // File exists. Send it back.
                    sendImage( posterFileName );
                } else {
                    sendBlank();
                }
            });
        });
    }

    function isValidUrl( str ) {
        try {
            new URL( str );
            return true;
        } catch(o_0) {
            return false;
        }
    }
};
