import nodepath from 'path';
import {stripExtension} from '@deflock/path';
import {transformAsync} from '@babel/core';
import GenericProcessor from '@assettler/core/lib/generic-processor';

/**
 *
 */
export default class Processor extends GenericProcessor {
    /**
     * @param {string} destDir
     * @param {Object} options
     */
    constructor(destDir, options = {}) {
        super(Object.assign({
            extensions: ['.mjs', '.js'],
        }, options));

        this.destDir = destDir;
    }

    /**
     * @param {Object} file
     * @param {Object} params
     * @returns {Promise<void>}
     */
    async onInit(file, params) {
        return this.doTrack(file, params);
    }

    /**
     * @param {Object} file
     * @param {Object} params
     * @returns {Promise<void>}
     */
    async onAdd(file, params) {
        return this.doTrack(file, params);
    }

    /**
     * @param {Object} file
     * @param {Object} params
     * @returns {Promise<void>}
     */
    async onChange(file, params) {
        return this.doTrack(file, params);
    }

    /**
     * @param {Object} file
     * @param {Object} params
     * @returns {Promise<void>}
     */
    async doTrack(file, params) {
        const relativePath = file.path;
        const basedir = params.basedir || params.cwd;

        const srcPath = nodepath.resolve(basedir, relativePath);
        const buildPath = stripExtension(nodepath.resolve(this.destDir, relativePath)) + '.js';

        const content = await this.readFile(srcPath, 'utf8');
        const result = await transformAsync(content, Object.assign({
            filename: srcPath,
        }, this.options.babelConfig || {}));

        await this.writeFile(buildPath, result.code);
    }
}
