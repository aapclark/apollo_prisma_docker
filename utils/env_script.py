import sys
import os

"""
This script intakes a provided .env file (eg. development.env) and loads its values into an .env at the root. This is to accomodate some difficulties in directing `docker-compose` to refer to an env other than .env in the root directory.

To run this script, execute 'python3 ../path_to_folder/original_env.env'. Because of the way the project is structured, the script will remove the current root .env file and replace it with a newly generated one. The script does not accept a destination argument, and simply places the .env in the directory above. In this case it's ./ where the script is located in ./utils.
"""


def checkArgs(args):
    if len(args) > 2:
        print(f'Too many arguments provided. Please specify only the script and target file name')
    if len(args) == 1:
        print(
            f'Please specify the targed env file name. ex. ../configuration/development.env')


def removePrevious():
    try:
        os.remove('../.env')
        print('Removing previous environment file.')
    except:
        print('File not found.')
    else:
        print('No previous environment file found.')


checkArgs(sys.argv)


filename = sys.argv[1]
print(f'specified filename is {filename}')
f = open(filename)
w = open('../.env', 'w')

print(f'Writing new ENVs from {filename}')
for line in f:
    if line[0] == '#':
        print('Skipping comment line.')
    else:
        w.write(line)

f.close()
w.close()

print('Successfully added environment variables.')
