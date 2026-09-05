<?php

test('returns a successful response', function () {
    $response = $this->get(route('catalog.index'));

    $response->assertOk();
});
