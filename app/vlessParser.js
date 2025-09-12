function parseVlessToXrayConfig(vlessUrl) {
    try {
        const url = new URL(vlessUrl);
        const uuid = url.username;
        const host = url.hostname;
        const port = parseInt(url.port);
        const params = url.searchParams;
        const remark = url.hash.slice(1);

        const config = {
            protocol: 'vless',
            settings: {
                vnext: [
                    {
                        address: host,
                        port: port,
                        users: [
                            {
                                id: uuid,
                                flow: params.get('flow') || '',
                                encryption: params.get('encryption') || 'none'
                            }
                        ]
                    }
                ]
            },
            streamSettings: {
                network: params.get('type') || 'tcp',
                security: params.get('security') || 'none'
            },
            tag: remark || 'vless-outbound'
        };

        const security = params.get('security');
        if (security === 'reality') {
            config.streamSettings.realitySettings = {
                serverName: params.get('sni'),
                fingerprint: params.get('fp'),
                publicKey: params.get('pbk'),
                shortId: params.get('sid'),
                spiderX: params.get('spx')
            };
        } else if (security === 'tls') {
            config.streamSettings.tlsSettings = {
                serverName: params.get('sni'),
                alpn: params.get('alpn') ? params.get('alpn').split(',') : [],
                allowInsecure: params.get('allowInsecure') === '1',
                fingerprint: params.get('fp')
            };
        }

        const network = params.get('type');
        if (network === 'ws') {
            config.streamSettings.wsSettings = {
                path: params.get('path') || '/',
                headers: {
                    Host: params.get('host') || host
                }
            };
        } else if (network === 'grpc') {
            config.streamSettings.grpcSettings = {
                serviceName: params.get('serviceName') || '',
                multiMode: params.get('mode') === 'multi'
            };
        } else if (network === 'http') {
            config.streamSettings.httpSettings = {
                path: params.get('path') || '/',
                host: params.get('host') ? params.get('host').split(',') : [host]
            };
        }

        return config;
    } catch (error) {
        throw new Error('Invalid VLESS URL: ' + error.message);
    }
}

module.exports = parseVlessToXrayConfig