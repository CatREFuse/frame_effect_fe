import csv
from pprint import pprint
import json


def handle_csv(file_name):
    with open(f'./{file_name}.csv', 'r') as f:
        reader = csv.reader(f)
        arr = []
        for row in reader:
            dict = {}
            dict['start'] = [row[0], row[1]]
            dict['target'] = [row[2], row[3]]
            arr.append(dict)
        arr.pop(0)
        pprint(arr)
        json_str = json.dumps(arr)
        with open(f'./{file_name}.json', 'w+') as jn:
            jn.write(json_str)


if __name__ == "__main__":
    handle_csv('grid')
