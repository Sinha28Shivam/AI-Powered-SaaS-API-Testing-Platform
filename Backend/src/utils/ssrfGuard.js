import dns from 'dns';
import { promisify } from 'util';
import ipaddr from 'ipaddr.js';

const lookupAsync = promisify(dns.lookup);

export const validateTargetUrl = async (targetUrl) => {
    try {
        const parsedUrl = new URL(targetUrl);

        // Only allow http and https
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            throw new Error('Invalid protocol. Only http and https are allowed.');
        }
        //  resolve the hostname to an ip address
        const { address } = await lookupAsync(parsedUrl.hostname);
        //  parse the ip using ipaddr.js
        const ip = ipaddr.parse(address);

        const range = ip.range();
        const unsafeRanges = [
            'private',        // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
            'loopback',       // 127.0.0.0/8, ::1
            'linkLocal',      // 169.254.0.0/16 (AWS/GCP metadata)
            'multicast',      // 224.0.0.0/4
            'broadcast',      // 255.255.255.255/32
            'unspecified'     // 0.0.0.0/8
        ];
        if (unsafeRanges.includes(range)) {
            throw new Error(`Security violation: target URL resolves to a  protected internal network (${range})`);
        }
        return true;


    } catch (error) {
        throw new Error(error.message || 'Invalid target URL');
    }

};