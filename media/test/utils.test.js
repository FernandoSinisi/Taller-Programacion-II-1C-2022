const assert = require("assert");

const ResponseMock = require("./mocks/ResponseMock");

const {DateMock} = require("./mocks/DateMock");

const FormattableDateMock = require("./mocks/FormattableDateMock").FormattableDateMockDateMock;

const rewire = require("rewire");

const {setErrorResponse,
       setBodyResponse,
       getDateFromCreatedAtAttribute,
       areAnyUndefined} = require("../src/others/utils");


describe("utils", () => {
    it('setResponse mock', async function () {
        let res = new ResponseMock();

        setBodyResponse("",
                        200,
                        res);

        assert.strictEqual(res.getStatus(),
                           200);
    });

    it('setErrorResponse mock', async function () {
        let res = new ResponseMock();

        setErrorResponse("",
            401,
            res);

        assert.strictEqual(res.getStatus(),
                           401);
    });

    it('getDate', () => {
        const utilsFile = rewire("../src/others/utils");

        utilsFile.__set__({
            'Date': DateMock
        });

        assert.strictEqual(utilsFile.getDate(),
                           '222T');
    });

    it('areAnyUndefined', () => {
        assert.strictEqual(areAnyUndefined(["", "a"]), true);
        assert.strictEqual(areAnyUndefined(["a", "b"]), false);
    });

    describe("getDateFromCreatedAtAttribute", () => {
        it("formats a timestamp correctly", () => {
            const actual = getDateFromCreatedAtAttribute(
                new FormattableDateMock("2022-06-05T22:48:26.648Z") );

            const expected = "05/06/2022";

            assert.strictEqual(expected,
                               actual);
        } );
    } )
} )
