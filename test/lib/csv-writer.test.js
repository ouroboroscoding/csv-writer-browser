
const CsvWriter = require('../../lib/csv-writer');

describe('CsvWriter', () => {

    it('writes a header row', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const fieldStringifier = {stringify: string => string};
        const header = [
            {id: 'FIELD_A', title: 'TITLE_A'},
            {id: 'FIELD_B', title: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            fieldStringifier,
            path: 'FILE_PATH',
            header
        });

        return writer.writeHeader().then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                'TITLE_A,TITLE_B\n',
                {encoding: 'utf8'}
            ]);
        });
    });

    it('writes a header row before it writes the first data row', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const fieldStringifier = {stringify: string => string};
        const header = [
            {id: 'FIELD_A', title: 'TITLE_A'},
            {id: 'FIELD_B', title: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            fieldStringifier,
            path: 'FILE_PATH',
            header
        });

        const record = {
            FIELD_A: 'VALUE_A1',
            FIELD_B: 'VALUE_B1'
        };
        return writer.writeRecord(record).then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                'TITLE_A,TITLE_B\nVALUE_A1,VALUE_B1\n',
                {encoding: 'utf8'}
            ]);
        });
    });

    it('opens a write file with append mode from the second write call', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const fieldStringifier = {stringify: string => string};
        const header = [
            {id: 'FIELD_A', title: 'TITLE_A'},
            {id: 'FIELD_B', title: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            fieldStringifier,
            path: 'FILE_PATH',
            header
        });

        const record1 = {FIELD_A: 'VALUE_A1', FIELD_B: 'VALUE_B1'};
        const record2 = {FIELD_A: 'VALUE_A2', FIELD_B: 'VALUE_B2'};
        return Promise.resolve()
            .then(() => writer.writeRecord(record1))
            .then(() => writer.writeRecord(record2))
            .then(() => {
                expect(fs.writeFile.args[1].slice(0, 3)).to.eql([
                    'FILE_PATH',
                    'VALUE_A2,VALUE_B2\n',
                    {
                        encoding: 'utf8',
                        flag: 'a'
                    }
                ]);
            });
    });

    it('writes no header row if it is not given', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const fieldStringifier = {stringify: value => String(value)};
        const header = ['FIELD_A', 'FIELD_B'];
        const writer = new CsvWriter({
            fs,
            fieldStringifier,
            path: 'FILE_PATH',
            header
        });

        const record = {
            FIELD_A: 'VALUE_A1',
            FIELD_B: 'VALUE_B1'
        };
        return writer.writeRecord(record).then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                'VALUE_A1,VALUE_B1\n',
                {encoding: 'utf8'}
            ]);
        });
    });

    it('writes multiple records at once', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const fieldStringifier = {stringify: string => string};
        const header = [
            {id: 'FIELD_A', title: 'TITLE_A'},
            {id: 'FIELD_B', title: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            fieldStringifier,
            path: 'FILE_PATH',
            header
        });

        const records = [
            {FIELD_A: 'VALUE_A1', FIELD_B: 'VALUE_B1'},
            {FIELD_A: 'VALUE_A2', FIELD_B: 'VALUE_B2'}
        ];
        return writer.writeRecords(records).then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                'TITLE_A,TITLE_B\nVALUE_A1,VALUE_B1\nVALUE_A2,VALUE_B2\n',
                {encoding: 'utf8'}
            ]);
        });
    });
});