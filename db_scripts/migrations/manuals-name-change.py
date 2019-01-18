#!/usr/bin/env python

import sys,traceback,os,datetime,pprint,imp,argparse,logging,json

#import tqdm
utils = imp.load_source('utils', '/servers/harbinger/harbinger/general-et/utils.py')
TABLE_NAME = 'airflow_site_config'
NEW_NAME = 'patient-flow'
ADMIN_URL = 'https://docs.analytical.info/app-manuals/%s/admin-manual.pdf' % NEW_NAME
USER_URL = 'https://docs.analytical.info/app-manuals/%s/user-manual.pdf' % NEW_NAME

def main(h,opts):
    site_config_sql = ''' select * from %s order by id desc limit 1''' % TABLE_NAME
    h.hcurs.execute(site_config_sql)
    site_config = h.hcurs.fetchone()
    site_config = dict(site_config.items())
    NOW = datetime.datetime.now()
    changed = False

    logging.info('fetched site config: %s',len(site_config))

    parsed = json.loads(site_config['configuration_json'])

    if parsed.get("admin_manual"):
        parsed["admin_manual"] = ADMIN_URL
        changed = True

    if parsed.get("user_manual"):
        parsed["user_manual"] = USER_URL
        changed = True

    if changed == True:
	site_config.pop('id', None)
        site_config['created_at'] = NOW
        site_config['configuration_time'] = NOW
        site_config['updated_at'] = NOW
        site_config['configuration_json'] = json.dumps(parsed)

        try:
            rid = utils.insert_dict(h.hcurs,TABLE_NAME,site_config)
            logging.info('inserted new site configuration %s',repr(site_config))
        except Exception as e:
            logging.error(e)
            logging.error('unable to insert new site configuration %s',repr(site_config))

        h.hdb.commit()
    else:
        logging.info('manuals were not in site configuration, using default')

if __name__ == '__main__':
    DSC = '/servers/harbinger/config/site.config.json'
    try:
        parser = argparse.ArgumentParser(description='migrate site configuration to use new application name')
        parser.add_argument('--config', help='path to site configuration', default=DSC, metavar=DSC)
        opts = parser.parse_args()
    except Exception as e:
        print repr(e)
        sys.exit(1)
    try:
        h = utils.HarbingerETEnv(opts.config,'airflow-manuals-name-change.log',amqp=False,db=True,schema='airflow')
        main(h,opts)
    except Exception as e:
        logging.critical(traceback.format_exc())
        print 'CRITICAL ERROR: %s' % e
        sys.exit(1)

    h.close()
    sys.exit(0)
