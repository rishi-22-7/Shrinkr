const Counter = require('../models/Counter');
const Url = require('../models/Url');
const { encode } = require('../utils/base62Converter');

const COUNTER_ID = 'url_count';

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * POST /api/url/shorten
 */
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    if (!originalUrl || typeof originalUrl !== 'string') {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Please provide a valid HTTP or HTTPS URL' });
    }

    let shortCode;

    if (customCode) {
      if (typeof customCode !== 'string') {
        return res.status(400).json({ error: 'customCode must be a string' });
      }

      // Validate custom code format (alphanumeric, underscores, hyphens, 3 to 30 chars)
      const customCodeRegex = /^[a-zA-Z0-9_-]{3,30}$/;
      if (!customCodeRegex.test(customCode)) {
        return res.status(400).json({
          error: 'Custom code must be alphanumeric (plus "_" or "-") and between 3 and 30 characters long.',
        });
      }

      // Ensure custom code is not already in use
      const existingCode = await Url.findOne({ shortCode: customCode });
      if (existingCode) {
        return res.status(409).json({ error: `Short code "${customCode}" is already in use.` });
      }

      shortCode = customCode;
    } else {
      // Fallback: Automatic sequential code generation
      // Optimization: Check if this URL already has an automatically generated code
      const existingUrl = await Url.findOne({ originalUrl });
      if (existingUrl) {
        const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
        const shortUrl = `${baseUrl}/${existingUrl.shortCode}`;
        return res.status(200).json({
          originalUrl: existingUrl.originalUrl,
          shortUrl,
          shortCode: existingUrl.shortCode,
        });
      }

      const counter = await Counter.findOneAndUpdate(
        { _id: COUNTER_ID },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

      const sequenceValue = counter.sequence_value;
      shortCode = encode(sequenceValue);
    }

    const urlDocument = await Url.create({
      originalUrl,
      shortCode,
    });

    const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const shortUrl = `${baseUrl}/${shortCode}`;

    return res.status(201).json({
      originalUrl,
      shortUrl,
      shortCode,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: messages[0] || 'Validation error occurred' });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Short code collision detected' });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET /:shortCode
 */
const redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlDocument = await Url.findOne({ shortCode });

    if (!urlDocument) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Safely increment clicks in background and catch any potential failures
    Url.updateOne({ shortCode }, { $inc: { clicks: 1 } })
      .catch((err) => console.error(`Failed to increment clicks for ${shortCode}:`, err.message));

    return res.redirect(301, urlDocument.originalUrl);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  shortenUrl,
  redirectToOriginal,
};
