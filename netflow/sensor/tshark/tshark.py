import json
import os
import signal
import subprocess
import sys

import yaml

closing = False


def _exit(signum, frame):
    global closing
    closing = True


def _set_interruption_handlers():
    signal.signal(signal.SIGTERM, _exit)
    signal.signal(signal.SIGINT, _exit)


def _drop_index_line(line):
    decoded_line = line.decode().rstrip('\n')
    if decoded_line.startswith('{\"index\":') is True:
        return None
    else:
        return decoded_line


def _make_capturing_command(interface, packet_filter):
    if interface is None:
        print('Interface is not specified')
        sys.exit(1)

    command = list()

    config_path = './espcap.yml'
    if os.path.isfile(config_path):
        with open(config_path, 'r') as yaml_config:
            config = yaml.load(yaml_config, Loader=yaml.FullLoader)
        command.append(config['tshark_path'])
    else:
        print("Could not find configuration file")
        sys.exit(1)

    command.append('-T')
    command.append('ek')
    command.append('-i')
    command.append(interface)

    if packet_filter is not None:
        elements = packet_filter.split()
        for element in elements:
            command.append(element)

    return command


def capture(interface, packet_filter):
    command = _make_capturing_command(interface, packet_filter)

    global closing
    with subprocess.Popen(command, stdout=subprocess.PIPE, bufsize=1) as proc:
        for packet in proc.stdout:
            packet = _drop_index_line(packet)
            if packet is None:
                continue
            else:
                yield json.loads(packet)

        if closing is True:
            print('Capture interrupted')
            sys.exit()