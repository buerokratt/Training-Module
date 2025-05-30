#!/bin/bash

docker run --rm --network bykstack -v `pwd`/DSL/Liquibase:/liquibase/changelog liquibase/liquibase --defaultsFile=/liquibase/changelog/liquibase.properties --changelog-file=/changelog/test.yml --contexts=test update
