const bowser = require('bowser');
const Logger = require('./Logger');
const Chrome70 = require('./handlers/Chrome70');
const Chrome67 = require('./handlers/Chrome67');
const Chrome55 = require('./handlers/Chrome55');
const Safari12 = require('./handlers/Safari12');
const Safari11 = require('./handlers/Safari11');
const Firefox60 = require('./handlers/Firefox60');
const Edge11 = require('./handlers/Edge11');
const ReactNative = require('./handlers/ReactNative');

const logger = new Logger('detectDevice');

module.exports = function()
{
	// React-Native.
	if (typeof navigator === 'object' && navigator.product === 'ReactNative')
	{
		if (typeof RTCPeerConnection !== 'undefined')
		{
			return ReactNative;
		}
		else
		{
			logger.warn('unsupported ReactNative without RTCPeerConnection');

			return null;
		}
	}
	// browser.
	else if (typeof navigator === 'object' && typeof navigator.userAgent === 'string')
	{
		const ua = navigator.userAgent;
		const browser = bowser.detect(ua);

		// Chrome, Chromium (desktop and mobile).
		if (bowser.check({ chrome: '70', chromium: '70' }, true, ua))
		{
			return Chrome70;
		}
		else if (bowser.check({ chrome: '67', chromium: '67' }, true, ua))
		{
			return Chrome67;
		}
		else if (bowser.check({ chrome: '55', chromium: '55' }, true, ua))
		{
			return Chrome55;
		}
		// Opera (desktop and mobile).
		else if (bowser.check({ opera: '57' }, true, ua))
		{
			return Chrome70;
		}
		else if (bowser.check({ opera: '44' }, true, ua))
		{
			return Chrome55;
		}
		// Firefox (desktop and mobile).
		else if (bowser.check({ firefox: '60' }, true, ua))
		{
			return Firefox60;
		}
		// Safari (desktop and mobile).
		else if (bowser.check({ safari: '12.1' }, true, ua))
		{
			return Safari12;
		}
		else if (bowser.check({ safari: '11' }, true, ua))
		{
			return Safari11;
		}
		// Edge (desktop).
		else if (bowser.check({ msedge: '11' }, true, ua))
		{
			return Edge11;
		}
		// Best effort for Chromium based browsers.
		else if (browser.chromium || browser.blink || browser.webkit)
		{
			logger.debug('best effort Chromium based browser detection');

			const match = ua.match(/(?:(?:Chrome|Chromium))[ /](\w+)/i);

			if (match)
			{
				const version = Number(match[1]);

				if (version >= 70)
					return Chrome70;
				else if (version >= 67)
					return Chrome67;
				else
					return Chrome55;
			}
			else
			{
				return Chrome70;
			}
		}
		// Unsupported browser.
		else
		{
			logger.warn(
				'browser not supported [name:%s, version:%s]',
				browser.name, browser.version);

			return null;
		}
	}
	// Unknown device.
	else
	{
		logger.warn('unknown device');

		return null;
	}
};
