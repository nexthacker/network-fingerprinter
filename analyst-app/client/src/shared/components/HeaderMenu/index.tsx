import React, { FC } from 'react';
import { useHeaderMenu } from 'root/shared/components/HeaderMenu/hook';
import Menu from 'antd/es/menu';
import Icon from 'antd/es/icon';
import { I18MainNsKeys } from 'root/i18n/resources/main/keys';
import { RouterPages } from 'root/router/constants/pages';
import { StreamsRouterTransport } from 'root/streams/constants/router/transport';

interface IProps {
}

enum MenuItemKey {
    TcpStream = 'TcpStream',
    UdpStream = 'UdpStream',
}

export const HeaderMenu: FC<IProps> = () => {
    const { onClickTcpStreams, onClickUdpStreams, transport, t, page } = useHeaderMenu();
    const tcpStreamsSelected = page === RouterPages.Streams && transport === StreamsRouterTransport.Tcp;
    const udpStreamsSelected = page === RouterPages.Streams && transport === StreamsRouterTransport.Udp;

    const selectedKeys = [
        ...(tcpStreamsSelected ? [ MenuItemKey.TcpStream ] : []),
        ...(udpStreamsSelected ? [ MenuItemKey.UdpStream ] : []),
    ];

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={ selectedKeys }
            style={{ lineHeight: '64px' }}
        >
            <Menu.Item
                key={ MenuItemKey.TcpStream }
                onClick={ onClickTcpStreams }
            >
                <Icon type="branches" />
                <span>
                    TCP { t(I18MainNsKeys.menuStreamsLabel) }
                </span>
            </Menu.Item>
            <Menu.Item
                key={ MenuItemKey.UdpStream }
                onClick={ onClickUdpStreams }
            >
                <Icon type="select" />
                <span>
                    UDP { t(I18MainNsKeys.menuStreamsLabel) }
                </span>
            </Menu.Item>
        </Menu>
    );
};
