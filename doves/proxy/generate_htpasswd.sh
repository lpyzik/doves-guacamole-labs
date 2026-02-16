#!/bin/bash

echo 'creating .htpasswd'
htpasswd -c -B -b /etc/nginx/.htpasswd $USERNAME $PASSWORD
echo '.htpasswd created'
