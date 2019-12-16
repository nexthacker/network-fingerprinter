import {Injectable} from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';
import {map} from 'rxjs/operators';
import {IPacketEntity} from '../../Entities/Packet/IPacketEntity';
import {IPacketView} from './IPacketView';
import {SearchResponse} from 'elasticsearch';
import {mapPacketEntityToView} from '../../Mappers/Packet/PacketEntityToView';
import { ITcpPacketView } from './Tcp/ITcpPacketView';

@Injectable()
export class PacketViewProvider {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async getTcpPackets(): Promise<ITcpPacketView[]> {
        return this.elasticsearchService
            .search<IPacketEntity>({
                index: 'packets-*',
                size: 1000,
                body: {
                    query: {
                        exists: {
                            field: 'layers.tcp',
                        },
                    },
                },
            })
            .pipe(map(PacketViewProvider.mapSearchResponseToPacketViews))
            .toPromise();
    }

    async getPackets(): Promise<IPacketView[]> {
        return this.elasticsearchService
            .search<IPacketEntity>({
                index: 'packets-*',
                size: 1000,
                body: {
                    query: {
                        exists: {
                            field: 'layers.tcp',
                        },
                    },
                },
            })
            .pipe(map(PacketViewProvider.mapSearchResponseToPacketViews))
            .toPromise();
    }

    private static mapSearchResponseToPacketViews(response: SearchResponse<any>): IPacketView[] {
        return response[0].hits.hits
            .map(hit => mapPacketEntityToView(hit._source));
    }
}
