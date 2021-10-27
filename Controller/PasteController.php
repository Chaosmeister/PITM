<?php

namespace Kanboard\Plugin\PITM\Controller;

use Kanboard\Controller\BaseController;

class PasteController extends BaseController
{
    public function upload()
    {
        $values = $this->request->getJson();
        $base64Image = explode(',', $values['data'])[1];

        $taskId = $values['task_id'];

        if (isset($taskId))
        {
            $ImageId = $this->taskFileModel->uploadScreenshot($taskId, $base64Image);

            if ($ImageId)
            {
                $this->response->html('<img src="?controller=FileViewerController&action=image&task_id=' . $taskId . '&file_id=' . $ImageId . '" class="enlargable" />');
            }
        }
        else
        {
            $tempPath = $values['path'];

            $ImageId = $this->pasteFileModel->storeTempContent($tempPath, $base64Image);

            if ($ImageId)
            {
                $this->response->html('<PITM:' . $ImageId . '>');
            }
        }
    }
}
